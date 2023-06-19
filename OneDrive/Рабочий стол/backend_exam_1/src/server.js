import { createServer } from "http";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { readFileCustom } from "./helpers/read-helper.js";
import { writeFileCustom } from "./helpers/write-helper.js";
import { sign, verify } from "./helpers/jwt-helper.js";

dotenv.config();

const PORT = 2024;
const options = {
  "Content-Type": "application/json",
};

const server = createServer((req, res) => {
  const method = req.method;
  const url = req.url.split("/")[1];
  const urlId = req.url.split("/")[2];

  const checkAdmin = (accessToken) => {
    try {
      const { id, role } = verify(accessToken);

      if (role != "admin") {
        res.writeHead(403, options);
        res.end(
          JSON.stringify({
            message: "Access denied",
          })
        );
        return;
      }
      return user;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.writeHead(401, options);
        res.end(
          JSON.stringify({
            message: "Access expired",
          })
        );
        return;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        res.writeHead(401, options);
        res.end(
          JSON.stringify({
            message: "Access invalid",
          })
        );
        return;
      }
    }
  };

  if (method == "GET") {
  }
  if (method == "POST") {
    if (url == "sign-in") {
      req.on("data", (chunk) => {
        const { username, password } = JSON.parse(chunk);

        const user = readFileCustom("users.json").find(
          (el) => el.username == username && el.password && password
        );

        if (!user) {
          res.writeHead(401, options);
          res.end(
            JSON.stringify({
              message: "Unauthorized",
            })
          );
          return;
        }
        res.writeHead(200, options);
        res.end(
          JSON.stringify({
            message: "Authorized",
            accessToken: sign({ id: user.id, role: user.role }),
          })
        );
        return;
      });
    }
    if (url == "markets") {
      const accessToken = req.headers["authorization"];
      checkAdmin(accessToken);

      req.on("data", (chunk) => {
        const { marketName } = JSON.parse(chunk);

        const allMarket = readFileCustom("markets.json");
        allMarket.push({
          id: allMarket.at(-1).id + 1 || 1,
          marketName,
        });
        writeFileCustom("markets.json", allMarket);
        res.writeHead(200, options);
        res.end(
          JSON.stringify({
            message: "Market successfully created",
          })
        );
        return;
      });
    }
    if (url == "branches") {
      const accessToken = req.headers["authorization"];
      checkAdmin(accessToken);

      req.on("data", (chunk) => {
        const { branchName, marketId } = JSON.parse(chunk);

        const allBranches = readFileCustom("branches.json");
        allBranches.push({
          id: allBranches.at(-1).id + 1 || 1,
          branchName,
          marketId,
        });
        writeFileCustom("branches.json", allBranches);
        res.writeHead(200, options);
        res.end(
          JSON.stringify({
            message: "Branch successfully created",
          })
        );
        return;
      });
    }
    if (url == "employees") {
      const accessToken = req.headers["authorization"];
      checkAdmin(accessToken);

      req.on("data", (chunk) => {
        const { name, gender, branchId } = JSON.parse(chunk);

        const allEmployees = readFileCustom("employees.json");
        allEmployees.push({
          id: allEmployees.at(-1).id + 1 || 1,
          name,
          gender,
          branchId,
        });
        writeFileCustom("employees.json", allEmployees);
        res.writeHead(200, options);
        res.end(
          JSON.stringify({
            message: "Employee successfully created",
          })
        );
        return;
      });
    }
		if (url == "products") {
      const accessToken = req.headers["authorization"];
      checkAdmin(accessToken);

      req.on("data", (chunk) => {
        const { title, price, branchId } = JSON.parse(chunk);

        const allProducts = readFileCustom("products.json");
        allProducts.push({
          id: allProducts.at(-1).id + 1 || 1,
          title,
          price,
          branchId,
        });
        writeFileCustom("products.json", allProducts);
        res.writeHead(200, options);
        res.end(
          JSON.stringify({
            message: "Products successfully created",
          })
        );
        return;
      });
    }
  }
  if (method == "PATCH") {
  }
  if (method == "DELETE") {
  }
});

server.listen(PORT, console.log("waiting ..."));