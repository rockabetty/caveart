const path = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@components': path.resolve(__dirname, 'src/app/ui/components'),
  '@data': path.resolve(__dirname, 'src/data'),
  '@logger': path.resolve(__dirname, 'src/server/services/logger'),
  '@domains': path.resolve(__dirname, 'src/server/domains'),
  '@services': path.resolve(__dirname, 'src/server/services')
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
    USER_AUTH_TOKEN_NAME: process.env.USER_AUTH_TOKEN_NAME,
  },
}

module.exports = nextConfig
