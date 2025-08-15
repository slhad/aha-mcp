#!/usr/bin/env node
const https = require('https');
const semver = require('semver');

const repo = process.env.GITHUB_REPOSITORY;
const currentTag = process.env.TAG;
const token = process.env.GITHUB_TOKEN;

function fetchTags(page = 1, tags = []) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${repo}/tags?per_page=100&page=${page}`,
            headers: {
                'User-Agent': 'node.js',
                'Authorization': `token ${token}`
            }
        };
        https.get(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const result = JSON.parse(data);
                if (result.length === 100) {
                    fetchTags(page + 1, tags.concat(result)).then(resolve).catch(reject);
                } else {
                    resolve(tags.concat(result));
                }
            });
        }).on('error', reject);
    });
}

(async () => {
    try {
        const tags = await fetchTags();
        const tagNames = tags.map(t => t.name).filter(t => semver.valid(t));
        const maxTag = semver.sort(tagNames).pop();
        if (semver.eq(currentTag, maxTag)) {
            process.exit(0); // is latest
        } else {
            process.exit(1); // not latest
        }
    } catch (e) {
        console.error(e);
        process.exit(2);
    }
})();
