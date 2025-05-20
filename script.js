document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    const helpMessage = `
    <b>💻 System Commands:</b><br>
    <b>help or h</b>        - Show available commands<br>
    <b>clear or cls</b>       - Clear the terminal<br>
    <b>neofetch or fetch</b>    - Display system info<br>
    <br>
    <b>👤 Personal Information:</b><br>
    <b>whoami</b>      - Display my identity<br>
    <b>skills</b>      - Show my technical skills<br>
    <b>experience</b>    - Show my Professional Background<br>
    <b>others</b>      - Show my management/soft skills<br>
    <br>
    <b>🌐 Online Profiles:</b><br>
    <b>linkedin or ln</b>    - Open my LinkedIn profile<br>
    <b>github or gh</b>      - Open my GitHub profile<br>
    <br>
    <b>📄 Documents:</b><br>
    <b>resume or r</b>      - Download my resume<br>
    `;

    const commands = {
        help: helpMessage,
        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
          ..       :
         ,W,     .Et 
        t##,    ,W#t   User: martinizq
       L###,   j###t   OS: Martin's Resume Linux
     .E#j##,  G#fE#t   Hostname: martin.izquierdo
    ;WW; ##,:K#i E#t   Time: ${currentTime}
   j#E.  ##f#W,  E#t   Email: <a href="mailto:pmartin.izquierdob@gmail.com" class="custom-link">pmartin.izquierdob@gmail.com</a>
 .D#L    ###K:   E#t   GitHub: <a href="https://github.com/pmartinizquierdob" target="_blank" class="custom-link">GitHub.com/pmartinizquierdob</a>
:K#t     ##D.    E#t   LinkedIn: <a href="https://www.linkedin.com/in/martin-izquierdo" target="_blank" class="custom-link">LinkedIn.com/in/martin-izquierdo</a>
...      #G      ..    
         j             
                </pre>`;                      
        },

        github: () => {
            window.open("https://github.com/pmartinizquierdob", "_blank");
            return `Opening <a href="https://github.com/pmartinizquierdob" target="_blank" class="custom-link">GitHub/pmartinizquierdob</a>...`;
        },

        linkedin: () => {
            window.open("https://linkedin.com/in/martin-izquierdo", "_blank");
            return `Opening <a href="https://linkedin.com/in/martin-izquierdo" target="_blank" class="custom-link">LinkedIn/martin-izquierdo</a>...`;
        },

        experience: `
        - Backend: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt <br>  
        - App Integrations: et dolore magna aliqua. Ut enim ad minim veniam, <br>
        - Frontend: <a href="https://linkedin.com/in/martin-izquierdo" target="_blank" class="custom-link">example-link</a> quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br>
        - Microservices: <a href="https://github.com/pmartinizquierdob" target="_blank" class="custom-link">another-example</a> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<br>
        - Tools: Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        `,
        skills: `
        - Backend Development<br>
        - Java: Competitive Programming, Spring Boot, RESTful APIs<br>
        - Database: MongoDB, MySQL<br>
        - Version Control: Git<br>
        - CI/CD: Docker, GitHub CI/CD, Jenkins<br>
        - Tools: Postman<br>
        - OS: Linux, Windows, MacOS
        `,
        others: `
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>
        - Ed do eiusmod tempor incididunt<br>
        - Et dolore magna aliqua. Ut enim ad minim veniam,<br>
        - quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br>
        - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        `,
        whoami: `Hello!👋 I'm <a href="https://linkedin.com/in/martin-izquierdo" class="custom-link"> Martin Izquierdo</a> | Software Developer`,

        resume: () => {
            const link = document.createElement("a");
            link.href = "/home/martin/development/example-repos/portfolio/resume.pdf";
            link.download = "martin_resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return "Downloading resume...";
        },

        clear: () => resetTerminal(),
    };

    const aliases = {
        gh: "github",
        ln: "linkedin",
        r: "resume",
        cls: "clear",
        h: "help",
        fetch: "neofetch"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    function processCommand(cmd) {
        cmd = cmd.toLowerCase();
        if (cmd === "") {
            output.scrollTop = output.scrollHeight;
            return;
        }

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        if (aliases[cmd]) cmd = aliases[cmd];

        if (cmd === "clear" || cmd === "exit") {
            resetTerminal();
            return;
        }

        let response = typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd] || getClosestCommand(cmd);
        appendCommand(cmd, response);
    }

    function resetTerminal() {
        output.innerHTML = `<div class="help-message">Type 'help' to list available commands.</div>`;
        input.value = "";
        hint.textContent = "";
    }

    function appendCommand(command, result) {
        let commandLine = document.createElement("div");
        commandLine.classList.add("command-line");
        commandLine.innerHTML = `<span class="prompt">mizquierdo@portfolio:~$</span> ${command}`;
        output.appendChild(commandLine);

        let resultLine = document.createElement("div");
        resultLine.classList.add("command-result");
        resultLine.innerHTML = result;
        output.appendChild(resultLine);

        input.scrollIntoView({ behavior: "smooth" });
    }

    function getClosestCommand(inputCmd) {
        let closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch ? `Did you mean <b>${closestMatch}</b>?` : `Command not found: ${inputCmd} <br>Type 'help' to list available commands.`;
    }

    function updateAutocompleteHint() {
        let currentInput = input.value;
        if (!currentInput) {
            hint.textContent = "";
            return;
        }
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) {
            hint.textContent = match.slice(currentInput.length);
            mirror.textContent = currentInput;
            hint.style.left = mirror.offsetWidth + "px";
        } else {
            hint.textContent = "";
        }
    }

    function autocompleteCommand() {
        let currentInput = input.value;
        if (!currentInput) return;
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) input.value = match;
        hint.textContent = "";
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);

    terminal.addEventListener("click", function () {
        input.focus();
    });

    resetTerminal();
});
