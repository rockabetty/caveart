const path = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@components': path.resolve(__dirname, 'src/app/ui/components'),
  '@data': path.resolve(__dirname, 'src/data'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
