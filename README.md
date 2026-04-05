# Qwen-Skillsmith **Build consistent Qwen Code skills using standardized syntax and guided workflows.**

```bash
npx qwen-skillsmith
```

**Works on Mac, Windows, and Linux.**

## What Skillsmith Does

Qwen Code skills are markdown files that give Qwen a persona, routing logic, and domain knowledge. They're powerful — but there's no standard for how to write them. Every skill looks different. Entry points mix routing with process logic. Tasks miss required sections. Templates use inconsistent placeholders.

Skillsmith fixes this. It's a **meta-skill** — a skill that builds other skills — with four workflows:

1. **Discover** — Guided interview that captures every design decision and produces a structured skill spec
2. **Scaffold** — Takes a skill spec and generates a compliant directory with all files following syntax standards
3. **Distill** — Transforms raw source material (books, courses, transcripts) into structured framework chunks
4. **Audit** — Checks existing skills against the syntax specs and produces a compliance report

## Commands

| Command | What It Does |
|---------|-------------|
| `/skillsmith` | Show available workflows |
| `/skillsmith discover` | Guided interview to design a new skill — produces a skill spec |
| `/skillsmith scaffold` | Generate a compliant skill directory from a spec |
| `/skillsmith distill` | Transform raw source material into framework chunks |
| `/skillsmith audit` | Audit skill compliance against syntax specs |

## Syntax Specs

Skillsmith ships with 7 syntax specifications that enforce consistency:

| Spec | What It Standardizes |
|------|---------------------|
| **Entry Point** | Routing tables, persona blocks, activation criteria |
| **Tasks** | Required sections, XML structure, step formatting |
| **Templates** | Output templates, placeholder conventions |
| **Context** | Context file structure, @-reference patterns |
| **Frameworks** | Framework file organization, section ordering |
| **Rules** | Rule file structure, rule formatting |
| **Checklists** | Checklist format, acceptance criteria format |

## How It Works

```
/skillsmith discover    → Guided interview → skill-spec.md
/skillsmith scaffold    → skill-spec.md → compliant skill directory
/skillsmith distill     → Raw material → framework chunks
/skillsmith audit       → Existing skill → compliance report
```

## Ecosystem

| Tool | How Skillsmith Relates |
|------|----------------------|
| **qwen-seed** | SEED was built with Skillsmith — compliant entry point + tasks |
| **qwen-paul** | PAUL commands follow Skillsmith conventions |
| **carl-qwen** | CARL hook follows Skillsmith entry-point spec |
| **qwen-base** | BASE commands follow Skillsmith task conventions |
| **qwen-aegis** | AEGIS commands follow Skillsmith conventions |

Skillsmith is the **convention layer** — it makes all the other tools consistent.

## Install

```bash
npx qwen-skillsmith
```

### What Gets Installed

```
~/.qwen/commands/skillsmith/
├── skillsmith.md        Entry point (meta-skill)
├── tasks/               4 task files (discover, scaffold, distill, audit)
├── rules/               6 rule files (syntax enforcement)
├── templates/           Skill spec template
└── specs/               7 syntax specs
```

No hooks, no MCP servers. Skillsmith is pure markdown — zero runtime dependencies.

## Quick Start

```
# 1. Design a new skill
/skillsmith discover

# 2. Generate the compliant files
/skillsmith scaffold

# 3. Audit an existing skill
/skillsmith audit
```

## License

MIT License.

## Author

**Chris Kahler** — [Chris AI Systems](https://github.com/ChristopherKahler)
Adapted for Qwen Code by [tylergriffin1350](https://github.com/tylergriffin1350)
