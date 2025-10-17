import { cyan } from "colors";
import app from "./server";

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(cyan.italic.bold(`listening on http://localhost:${port}`))
})