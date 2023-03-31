import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: "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"
})
async function getPRName(page=1){
    const pulls = await octokit.pulls.list({
        owner: "anotherback",
        repo: "anotherback",
        state: "closed",
        base: "develop",
        sort: "created",
        direction: "desc",
        per_page: 30,
        page: page,
    });

    let list = pulls.data
    .filter(pull => pull.merged_at !== null)
    .map(pull => pull.title)
    .reverse();
    if(pulls.data.length === 30) list = [...await getPRName(page+1), ...list];
    return list;
}


let list = await getPRName();

console.log(list);

let br = 0;
let feat = 0;
let fix = 0;
for(const title of list){
    if(title.startsWith("[fix]"))fix++;
    else if(title.startsWith("[feat]"))feat++;
    else if(title.startsWith("[break]")){
        feat = 0;
        fix = 0;
        br++;
    }
}

console.log(br + "." + feat + "." + fix);