const projectCardsContainer = document.getElementById("project-cards-container");

const projectCardsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            projectCardsObserver.unobserve(entry.target);
        }
    })
}, { threshold: 0.3 })

async function getRepos() {
    const response = await fetch("https://api.github.com/users/bk24z/repos");
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const allRepos = await response.json();
    return allRepos.filter(repo => repo.topics.includes("portfolio-project"));
}

async function getRepoLanguages(repoName) {
    const response = await fetch(`https://api.github.com/repos/bk24z/${repoName}/languages`);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    return await response.json();
}

async function displayRepos() {
    try {
        const reposToDisplay = await getRepos();
        reposToDisplay.forEach(repo => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            const img = document.createElement("img");
            img.src = `https://socialify.git.ci/bk24z/${repo.name}/image?font=JetBrains+Mono&language=1&name=1&owner=1&stargazers=1&theme=Dark`;
            const name = document.createElement("h3");
            name.textContent = repo.name;
            const languagesContainer = document.createElement("div");
            languagesContainer.classList.add("languages-container");
            getRepoLanguages(repo.name)
                .then(languages => {
                    Object.keys(languages).forEach(language => {
                        const languageBadge = document.createElement("span");
                        languageBadge.textContent = language;
                        languagesContainer.appendChild(languageBadge);
                    })
                })
                .catch(error => console.error(`Error fetching languages for ${repo.name}:`, error));
            const description = document.createElement("p");
            description.textContent = repo.description;
            const link = document.createElement("a");
            link.href = repo.html_url;
            link.target = "_blank";
            const linkIcon = document.createElement("i");
            linkIcon.className = "fa-brands fa-github";
            link.append(linkIcon, "View on GitHub");
            projectCard.append(img, name, languagesContainer, description, link)
            projectCardsContainer.appendChild(projectCard);
            projectCardsObserver.observe(projectCard)
        })
    } catch (error) {
        console.error("Error fetching repos:", error);
        const message = document.createElement("p");
        message.textContent = "Unable to retrieve projects.";
        projectCardsContainer.appendChild(message);
    }
}

displayRepos();