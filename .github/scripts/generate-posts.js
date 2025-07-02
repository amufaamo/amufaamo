// .github/scripts/generate-posts.js

// 必要なモジュールを読み込みます
const fs = require('fs');

// GitHub Actionsの前のステップで作成された 'issues.json' ファイルを読み込みます
const issues = JSON.parse(fs.readFileSync('issues.json', 'utf8'));

console.log(`Found ${issues.length} issues to process.`);

// 各Issueをループ処理して、Markdownファイルを作成します
for (const issue of issues) {
  const date = new Date(issue.createdAt);
  const year = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  // "2025-07-02-issue-15.md" のようなファイル名を作成します
  const fileName = `${year}-${mm}-${dd}-issue-${issue.number}.md`;
  
  // ★★★ issue.body内の特殊文字（バッククォート）を安全な形に変換します！ ★★★
  const sanitizedBody = issue.body.replace(/`/g, '\\`');
  
  // Jekyllが読むための投稿ファイルの中身を作成します（Front Matterを含む）
  const fileContent = `---
layout: post
title: "${issue.title.replace(/"/g, '\\"')}"
date: ${issue.createdAt}
---

${sanitizedBody}
`;

  // _postsディレクトリに新しいファイルを書き出します
  fs.writeFileSync(`_posts/${fileName}`, fileContent);
  console.log(`Successfully generated: _posts/${fileName}`);
}

console.log('All posts have been generated successfully!');
