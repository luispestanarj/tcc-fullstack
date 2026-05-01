import './config/env';
import app from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${env.PORT}`);
  console.log(`   Ambiente: ${env.NODE_ENV}`);
});
