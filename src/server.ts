console.log("Server side code is running.");
import { createClient } from '@libsql/client';
import express, { Express, Request, Response } from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const client = createClient({
    url: "libsql://counter-szankdav.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTA3NjE4MTgsImlkIjoiNWJhYmIwOTItODk0Mi00NTU1LWI3NDAtYWM3OTE0OWI1MTNjIn0.tuaOahYx0A4DoDyGkbXoRUg-YS8_flmeeYzU7vlSYMTO1KDT86jV6EzjEmozYtdui1mhBg-rXydKA5_zatmCCQ",
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../../src/public')))
app.use('/css', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/js')));
app.use('/ts', express.static(path.join(__dirname, './public')));

app.listen(port, () => {
    console.log("Listening in 3000!");
})

app.get('/', (req: Request, res: Response) => {
    try {
      res.sendFile(path.resolve('./src/public/index.html'));
    } catch (error) {
      res.status(404).json({ error: "Page not found!" });
    }
});

app.get('/getNumber', async (req: Request, res: Response) => {
    try {
        const result = await client.execute("SELECT countedNumber FROM countedNumbers");
        const numberFromServer = result.rows[0]['countedNumber'];
        console.log(numberFromServer?.toString());
        res.status(200).json(numberFromServer);
    } catch (error) {
        console.error("Error while fetching the data:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.put("/increased", async (req: Request, res: Response) => {
  try {
    await client.execute("UPDATE countedNumbers SET countedNumber = countedNumber + 1");
    res.sendStatus(201);
  } catch (error) {
    console.error("Error while increasing the number:", error);
		res.status(500).json({ error: "An error occurred increasing the number." });
  }
});

app.put("/decreased", async (req: Request, res: Response) => {
    try {
      await client.execute("UPDATE countedNumbers SET countedNumber = countedNumber - 1");
      res.sendStatus(201);
    } catch (error) {
      console.error("Error while decreasing the number:", error);
		  res.status(500).json({ error: "An error occurred decreasing the number." });
    }
  });

  export default app;