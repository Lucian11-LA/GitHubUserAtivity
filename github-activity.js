
const axios= require('axios');
const [,, username] = process.argv;

if(!username)
{
    console.error('Use: github-ativity <username>');
    process.exit();
}

const  fetchGithubActivty = async(username) =>{

    try
    {
        const url = `https://api.github.com/users/${username}/events`;
        const response = await axios.get(url);

        return response.data;
    }
    catch (error)
    {
        if (error.response && response.status === 404)
        {
            console.error(`Erro: Usuario '${username} nao foi encontrado'`)
        }
        else
        {
            console.error(`Erro: nao foi possivel acessar a API`)
        }
        process.exit(1);
    }
};

const displayActivity = (events) => {
    if(events.length === 0)
    {
        console.log('Nenhuma atividade encontrada');
        return;
    }

    events.forEach(event => {
        const eventType = event.type;
        const repoName = event.repo.name;

        switch (eventType) {
            case 'PushEvent':
                const commits = event.payload.commits.length;
                console.log(`Pushed ${commits} commits to ${repoName}`);
                break;
            case 'IssuesEvent':
                console.log(`Opened a new Issue in ${repoName}`)
                break;
            case 'WatchEvent':
                console.log(`Starred ${repoName}`)
                break;
            default:
                console.log(`Activity: ${eventType}, em ${repoName} `)
        }

    });
};

const main = async () => {
    const events = await fetchGithubActivty(username);
    displayActivity(events);
}

main();