function handleUniqueConstraintError(error) {
  if (Array.isArray(error.meta?.target)) {
    return error.meta.target;
  }
  if (typeof error.meta?.target === "string") {
    return [error.meta.target];
  }

  const cause = error.meta?.driverAdapterError?.cause;
  if (
    Array.isArray(cause?.constraint?.fields) &&
    cause.constraint.fields.length > 0
  ) {
    return cause.constraint.fields;
  }

  const index = cause?.constraint?.index;
  const table = cause?.table || error.meta?.modelName;

  if (index) {
    let field = index;
    if (table && field.toLowerCase().startsWith(`${table.toLowerCase()}_`)) {
      field = field.slice(table.length + 1);
    }
    field = field.replace(/_key$/, "");
    return [field];
  }

  return [];
}

export { handleUniqueConstraintError };
