const fs = require('fs');

const data = fs.readFileSync('logfile.txt', 'utf8').split('\n');
const result = { users: {}, system_issues: [] };

const userRegex = /User\s+(\w+)\s+(.+?)\s+at\s+(\d{1,2}:\d{2}(AM|PM))/;
const issueRegex = /(Error|Warning):\s+(.+?)\s+at\s+(\d{1,2}:\d{2}(AM|PM))/;

data.forEach(line => {
  let m;
  if ((m = userRegex.exec(line))) {
    const [, user, action, time] = m;
    if (!result.users[user]) result.users[user] = [];
    result.users[user].push({ action, time });
  } else if ((m = issueRegex.exec(line))) {
    const [, type, desc, time] = m;
    result.system_issues.push({ type, description: desc, time });
  }
});

console.log(JSON.stringify(result, null, 2));
