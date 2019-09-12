var request = require('request');

const chalk  = require('chalk');

//var urlRoot = "https://api.github.com";
// NCSU Enterprise endpoint:
var urlRoot = "https://api.github.ncsu.edu";

var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.GITHUBTOKEN;

if( !config.token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));


if (process.env.NODE_ENV != 'test')
{
	(async () => {
		//  await listAuthenicatedUserRepos();
		// await listBranches("lkhuran", "HW1-510");
		// await createRepo("lkhran","newrepo1");
		// await createIssue("lkhuran", "newrepo1", "Issue-HW1");
		// await enableWikiSupport("lkhuran","HW1-510");

	})()
}

function getDefaultOptions(endpoint, method)
{
    var options = {
        url: urlRoot + endpoint,
        method: method,
        //body : JSON.stringify({name:"hello"})
        headers: {
            "User-Agent": "CSC510-REST-WORKSHOP",
            "content-type": "application/json",
            "Authorization": `token ${config.token}`
        }
    };
    return options;
}

async function getUser()
{
    let options = getDefaultOptions("/user", "GET");

    // Send a http request to url and specify a callback that will be called upon its return.
    return new Promise(function(resolve, reject)
    {
        request(options, function (error, response, body) {

            resolve( JSON.parse(body).login );
        });
    });
}

function listAuthenicatedUserRepos()
{
    let options = getDefaultOptions("/user/repos?visibility=all", "GET");
    // Send a http request to url and specify a callback that will be called upon its return.
    return new Promise(function(resolve, reject)
    {   console.log(options)
        request(options, function (error, response, body) 
        {
            console.log(response.statusCode)
            if( error )
            {
                console.log( chalk.red( error ));
                reject(error);
                return; // Terminate execution.
            }

            var new_obj = JSON.parse(body);
            for( var i = 0; i < new_obj.length; i++ )
            {
                var name = new_obj[i].name;
                console.log( name );
            }

            // Return new_object for people calling our method.
            resolve( new_obj );
        });
    });

}

// 1. Write code for listBranches in a given repo under an owner. See list branches
async function listBranches(owner,repo)
{
    let options = getDefaultOptions(`/repos/`+owner+`/`+repo+`/branches`, "GET");

    // Send a http request to url and specify a callback that will be called upon its return.
    return new Promise(function(resolve, reject)
    {
        request(options, function (error, response, body) {
            console.log(response.statusCode)
            if( error )
            {
                console.log( chalk.red( error ));
                reject(error);
                return; // Terminate execution.
            }

            var new_obj = JSON.parse(body);
            //console.log(new_obj) 
            for( var i = 0; i < new_obj.length; i++ )
            {
                var branch_name = new_obj[i].name;
                console.log( branch_name );
            }
            // console.debug( options );
            resolve( JSON.parse(body) );

        });
    });
}

// 2. Write code to create a new repo
async function createRepo(owner,repo)
{
    let options = getDefaultOptions('/user/repos', "POST");

    // Send a http request to url and specify a callback that will be called upon its return.
    return new Promise(function(resolve, reject)
    {
        //console.log(options)
        options["body"]=JSON.stringify({name:repo})
        // console.log(options)
        request(options, function (error, response, body) {

            if( error )
            {
                console.log( chalk.red( error ));
                reject(error);
                return; // Terminate execution.
            }

            var new_obj = JSON.parse(body);
            console.log(response.statusCode) 
            resolve( JSON.parse(response.statusCode) );

        });
    });
}
// 3. Write code for creating an issue for an existing repo.
async function createIssue(owner,repo,issueName)
{
    let options = getDefaultOptions("/repos/"+owner+"/"+repo+"/issues", "POST");

    options["body"]=JSON.stringify({title:"Test_Issue"})

    // Send a http request to url and specify a callback that will be called upon its return.
    return new Promise(function(resolve, reject){

        request(options, function (error, response, body) {

            if( error )
            {
                console.log( chalk.red( error ));
                reject(error);
                return; // Terminate execution.
            }
            console.log(response.statusCode)
            //var new_obj = JSON.parse(body);
            //console.log(new_obj) 
            resolve( JSON.parse(response.statusCode) );

        });
    });
}

// 4. Write code for editing a repo to enable wiki support.
async function enableWikiSupport(owner,repo)
{
    let options = getDefaultOptions("/repos/"+owner+"/"+repo, "PATCH");

    options["body"]=JSON.stringify({has_wiki:true})

    // Send a http request to url and specify a callback that will be called upon its return.
    return new Promise(function(resolve, reject)
    {
        
        request(options, function (error, response, body) {
            console.log(response.statusCode)
            resolve( JSON.parse(body) );
        });
    }); 
}

module.exports.getUser = getUser;
module.exports.listAuthenicatedUserRepos = listAuthenicatedUserRepos;
module.exports.listBranches = listBranches;
module.exports.createRepo = createRepo;
module.exports.createIssue = createIssue;
module.exports.enableWikiSupport = enableWikiSupport;
