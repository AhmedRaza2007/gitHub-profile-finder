
const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const result = document.getElementById("result");
searchBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();

try {
  const response = await fetch(
    `https://api.github.com/users/${username}`
  );

  if (!response.ok) {
    result.innerHTML = "<h2>No User Found</h2>";
    return;
  }

  const data = await response.json();

  const repoResponse = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  const repos = await repoResponse.json();

  let repoHTML = "";

  const topRepos = repos
  .sort((a, b) => b.stargazers_count - a.stargazers_count)
  .slice(0, 6);
  topRepos.forEach(repo => {
    repoHTML += `
  <div class="repo">
    <h3>
      <a href="${repo.html_url}" target="_blank">
        ${repo.name}
      </a>
    </h3>

    <p>
      ${repo.description || "No description available"}
    </p>

    <div class="repo-info">
      <span>⭐ ${repo.stargazers_count}</span>
      <span>${repo.language || "Unknown"}</span>
    </div>
  </div>
`;
  });

result.innerHTML = `
  <div class="profile-card">
    <img src="${data.avatar_url}" alt="${data.login}">

    <h2>${data.name || data.login}</h2>

    <p>${data.bio || "No bio available"}</p>

    <div class="stats">
      <div class="stat">
        Followers <br>
        <strong>${data.followers}</strong>
      </div>

      <div class="stat">
        Following <br>
        <strong>${data.following}</strong>
      </div>

      <div class="stat">
        Repos <br>
        <strong>${data.public_repos}</strong>
      </div>
    </div>
  </div>

  <h2 class="repo-title">Repositories</h2>

  <div class="repo-container">
    ${repoHTML}
  </div>
`;
} catch (error) {
  result.innerHTML = `
    <h2>Something went wrong</h2>
  `;
}
});

usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
