import bot from './bot';
import app from './app';

bot().catch(console.error);

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
