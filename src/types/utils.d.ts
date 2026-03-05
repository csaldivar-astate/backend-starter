type DatabaseConstraintError = {
  type:
    | 'unique'
    | 'check'
    | 'not null'
    | 'foreign key'
    | 'invalid input'
    | 'string too long'
    | 'numeric overflow'
    | 'invalid datetime'
    | 'unknown';
  columnName?: string;
  message?: string;
};
