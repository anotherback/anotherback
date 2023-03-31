import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: "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"
})

const pulls = await octokit.pulls.list({
    owner: "anotherback",
    repo: "anotherback",
    state: "closed",
    base: "develop",
    sort: "created",
    direction: "desc"
});

let list = pulls.data
.filter(pull => pull.merged_at !== null)
.map(pull => pull.title)
.reverse();

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