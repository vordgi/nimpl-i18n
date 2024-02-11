const withNextTranslation = require('next-translation/withNextTranslation').default;

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = async (phase) => {
    const withTranslation = await withNextTranslation(phase);
    return withTranslation(nextConfig);
};
