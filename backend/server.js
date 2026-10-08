const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bycrypt = require("bcrypt");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
const users = [
  {
    id: 1,
    name: "Ugyen",
  },
  {
    id: 2,
    name: "Sonam",
  },
  {
    id: 3,
    name: "Karma",
  },
];

const restaurants = [
  {
    id: 1,
    name: "The Bhutan Kitchen",
    city: "Thimphu",
  },
  {
    id: 2,
    name: "Mountain Cafe",
    city: "Paro",
  },
  {
    id: 3,
    name: "Thimphu Bites",
    city: "Thimphu",
  },
];

const menuItems = [
  {
    id: 1,
    name: "Ema Datshi",
    restaurantId: 1,
    price: 180,
  },
  {
    id: 2,
    name: "Chicken Momo",
    restaurantId: 1,
    price: 150,
  },
  {
    id: 3,
    name: "Beef Burger",
    restaurantId: 2,
    price: 250,
  },
  {
    id: 4,
    name: "French Fries",
    restaurantId: 2,
    price: 120,
  },
  {
    id: 5,
    name: "Chicken Thukpa",
    restaurantId: 3,
    price: 200,
  },
  {
    id: 6,
    name: "Veg Momo",
    restaurantId: 3,
    price: 130,
  },
];

const orders = [
  {
    id: 1,
    userId: 1,
    restaurantId: 1,
    totalAmount: 330,
    status: "delivered",
  },
  {
    id: 2,
    userId: 2,
    restaurantId: 2,
    totalAmount: 370,
    status: "preparing",
  },
  {
    id: 3,
    userId: 3,
    restaurantId: 3,
    totalAmount: 330,
    status: "pending",
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "Foodora API",
  });
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.json(user);
});

app.get("/api/restaurants/:id", (req, res) => {
  const id = Number(req.params.id);
  const restaurant = restaurants.find((res) => res.id === id);
  if (!restaurant) {
    return res.status(404).json({
      message: "Restaurant not found",
    });
  }
  res.json(restaurant);
});

app.get("/api/menu-items/:id", (req, res) => {
  const id = Number(req.params.id);
  const menuItem = menuItems.find((menu) => menu.id === id);
  if (!menuItem) {
    return res.status(404).json({
      message: "Menu item not found",
    });
  }
  res.json(menuItem);
});

app.get("/api/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  const order = orders.find((order) => order.id === id);
  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }
  res.join(order);
});

app.get("/api/restaurants", (req, res) => {
  const city = req.query.city;
  if (city) {
    const filteredRestaurants = restaurants.filter(
      (restaurant) => restaurant.city === city,
    );
    return res.json(filteredRestaurants);
  }
  res.json(restaurants);
});

app.get("/api/menu-items", (req, res) => {
  const restaurantId = Number(req.query.restaurantId);
  const { search } = req.query;
  const maxPrice = Number(req.query.maxPrice);

  let results = menuItems;
  if (restaurantId) {
    results = results.filter(
      (menuItem) => menuItem.restaurantId === restaurantId,
    );
  }
  if (search) {
    results = results.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (maxPrice) {
    results = results.filter((item) => item.price <= maxPrice);
  }

  res.json(results);
});

app.post("/api/v1/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if email already exist
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHas = await bycrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, phone)
      VALUES ($1,$2,$3,$4)
      RETURNING id,name,email,phone,created_at`,
      [name, email, passwordHas, phone],
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
