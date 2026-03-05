import { QueryFailedError } from 'typeorm';

function parseDatabaseError(err: unknown): DatabaseConstraintError {
  if (!(err instanceof QueryFailedError)) {
    return { type: 'unknown', message: 'An unknown database error has occurred.' };
  }

  // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  const { code, column, detail } = err.driverError;

  switch (code) {
    // Constraint violations
    case '23505': {
      // unique_violation
      const match = detail?.match(/Key \((.+?)\)=/);
      const columnName = match?.[1] ?? '';
      return {
        type: 'unique',
        columnName,
        message: `The '${columnName}' property must be unique.`,
      };
    }
    case '23502': {
      // not_null_violation
      const columnName = column ?? '';
      return {
        type: 'not null',
        columnName,
        message: `The '${columnName}' property must not be null.`,
      };
    }
    case '23514': // check_violation
      return { type: 'check', message: 'Failed a check constraint.' };
    case '23503': {
      // foreign_key_violation
      const match = detail?.match(/Key \((.+?)\)=/);
      const columnName = match?.[1] ?? '';
      return {
        type: 'foreign key',
        columnName,
        message: `The '${columnName}' property references a non-existent record.`,
      };
    }

    // Data validation errors
    case '22P02': // invalid_text_representation
      return {
        type: 'invalid input',
        message: 'Invalid input syntax (e.g., malformed UUID or wrong data type).',
      };
    case '22001': // string_data_right_truncation
      return {
        type: 'string too long',
        message: 'A string value exceeds the maximum allowed length.',
      };
    case '22003': // numeric_value_out_of_range
      return { type: 'numeric overflow', message: 'A numeric value is out of the allowed range.' };
    case '22007': // invalid_datetime_format
      return { type: 'invalid datetime', message: 'Invalid date or time format.' };

    default:
      return { type: 'unknown', message: 'An unknown database error has occurred.' };
  }
}

export { parseDatabaseError };
