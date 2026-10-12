class QueryBuilder {
  constructor() {
    this.conditions = [];
    this.values = [];
  }
  addValue(value) {
    const placeholder = `$${this.values.length + 1}`;
    this.values.push(value);
    return placeholder;
  }
  addCondition(condition) {
    this.conditions.push(condition);
  }
  addIn(column, items) {
    const placeholders = items.map(
      (_, index) => `$${this.values.length + index + 1}`,
    );
    this.conditions.push(`${column} IN (${placeholders.join(", ")})`);
    this.values.push(...items);
  }

  getWhereClause() {
    if (this.conditions.length === 0) {
      return "";
    }
    return `WHERE ${this.conditions.join(" AND ")}`;
  }
}

module.exports = QueryBuilder;
