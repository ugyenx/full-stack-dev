const QueryBulder = require("./backend/src/utils/queryBuilder");
const qb = new QueryBulder();
const searchPlaceholder = qb.addValues("%ugyen%");
console.log(searchPlaceholder);
qb.addCondition(
  `(name ILIKE ${searchPlaceholder}
        OR email ILIKE ${searchPlaceholder})`,
);

const minIdPlaceholder = qb.addValues(10);
qb.addCondition(`id >= ${minIdPlaceholder}`);

qb.addIn("role", ["admin", "user"]);

const array = [...qb.values];
console.log("array", array);
array.push("hello");
console.log(array);
console.log(qb.values);
const array2 = qb.values;
console.log(array2, "array2");
array2.push("hello");
console.log(array2);
console.log(qb.values);
