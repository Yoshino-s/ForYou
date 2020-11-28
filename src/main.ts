import express from "express";
import cors from "cors";
import { resolve } from "path";
import { readFileSync } from "fs";

const app = express();

app.use(cors());
app.use(express.static("static"));

let result: "accept" | "reject" | "" = "";

app.use("/main.py", (req, res) => {
  res.json({
    content: readFileSync(resolve(__dirname, "main.py")).toString(),
  });
})

app.use("/result.py", (req, res) => {
  console.log(result, req.query.action)
  if (!result) {
    if (req.query.action === "我愿意") {
      result = "accept";
    } else if (req.query.action === "对不起") {
      result = "reject";
    }
  }
  if (result) {
    res.json({
      content: readFileSync(resolve(__dirname, result + ".py")).toString(),
    });
  } else {
    res.redirect("/");
  }
});

app.listen(8888);