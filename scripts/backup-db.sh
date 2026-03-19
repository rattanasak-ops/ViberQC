#!/bin/bash
# ============================================================
# ViberQC — Database Backup Script
# Usage: bash scripts/backup-db.sh
# Cron:  0 2 * * * /path/to/ViberQC/scripts/backup-db.sh
# ============================================================

set -euo pipefail

# --- Config ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_DIR}/backups"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/viberqc_${DATE}.sql.gz"

# --- Load env (ถ้าไม่มี DATABASE_URL จาก environment) ---
if [ -z "${DATABASE_URL:-}" ]; then
  if [ -f "${PROJECT_DIR}/.env.local" ]; then
    export $(grep -v '^#' "${PROJECT_DIR}/.env.local" | grep DATABASE_URL | xargs)
  fi
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL not set"
  exit 1
fi

# --- Create backup dir ---
mkdir -p "$BACKUP_DIR"

echo "📦 Starting backup: $(date)"
echo "   → File: $BACKUP_FILE"

# --- Dump & compress ---
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "✅ Backup complete: $SIZE"

# --- Cleanup old backups ---
echo "🗑️  Removing backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -name "viberqc_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "📋 Current backups:"
ls -lh "$BACKUP_DIR"/viberqc_*.sql.gz 2>/dev/null || echo "   (none)"

echo "✅ Done: $(date)"
