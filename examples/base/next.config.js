const withI18n = require('@nimpl/i18n/withI18n').default;

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = async (phase) => {
    const withTranslation = await withI18n(phase);
    return withTranslation(nextConfig);
};
