export const getGitInfo = async () => {
    try {
        const response = await fetch("/api/git-info");
        const data = await response.json();
        return data;
    } catch (error) {
        return {
            commitHash: "dev",
            commitUrl: "https://github.com/Aruh1/best-release-indonesia"
        };
    }
};
