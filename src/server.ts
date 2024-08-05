import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 9999;

sequelize.sync({ force: false }).then(() => {
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
