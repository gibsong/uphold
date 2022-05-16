#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "postgres" <<-EOSQL
  CREATE DATABASE uphold;
  \connect uphold postgres
  BEGIN;
    CREATE TABLE IF NOT EXISTS historical_prices
    (
      currencypair varchar(10),
      price        double precision,
      dateTime     timestamptz,
      CONSTRAINT currencypair_datetime PRIMARY KEY(currencypair, dateTime)
  );

  COMMIT;
EOSQL
#consider adding index, but do more testing to determine if it makes sense
#CREATE INDEX idx_event_aggregate_id ON event (aggregate_id);