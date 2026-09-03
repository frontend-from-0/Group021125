|---------|-------------|
| `npx prisma init` | First-time setup |
| `npx prisma db push` | After changing `schema.prisma` (MongoDB) |
| `npx prisma generate` | Regenerate client after schema changes |
| `npx prisma studio` | Visual browser UI to inspect/edit data (great for demos) |
| `npx prisma db pull` | Existing DB → generate models (introspection) |
| `npx prisma validate` | Check schema syntax without connecting |
| `npx prisma format` | Format `schema.prisma` |

**MongoDB:** do **not** use `prisma migrate dev` — migrations are for SQL databases.