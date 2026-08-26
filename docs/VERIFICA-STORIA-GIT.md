# Verifica della storia git — assenza di co-autori

Controllo richiesto: nessun commit deve risultare co-autorato da Claude; tutti i commit devono
essere attribuiti a **Singh-Growe**.

## Esito

### Repository nuovo (Next.js) — `GroweDevelopers/WebSiteVillaSalina`

Creato da zero il 26/08/2026 con autore già configurato correttamente.

```
$ git log --all --format="%an <%ae> | committer: %cn <%ce>" | sort -u
Singh-Growe <account@growe.dev> | committer: Singh-Growe <account@growe.dev>

$ git log --all --format="%B" | grep -icE "co-authored|anthropic|generated with"
0
```

✅ **Un solo autore, nessun trailer di co-autore.**

### Repository originale ASP.NET — Azure DevOps `samuel001growe/WebSiteVillaSalina`

```
$ git log --all --format="%H%n%an%n%ae%n%cn%n%ce%n%B" | grep -icE "claude|co-authored|anthropic"
0

$ git log --all --format="%an <%ae>" | sort -u
Lorenzo Fiandino <samuel@polizzamigliore.it>
Samar Singh <samuel@polizzamigliore.it>
Samuel Shahinaj <samuel@polizzamigliore.it>
```

✅ **Nessun commit co-autorato da Claude: non serve alcuna riscrittura.**

I tre nomi presenti sono persone reali del team; non sono stati toccati perché la richiesta
riguarda esclusivamente la rimozione dei co-autori automatici.

## Controllo continuo

Da rieseguire prima di ogni push:

```bash
git log --all --format="%B" | grep -icE "co-authored|anthropic|generated with"   # atteso: 0
git log --all --format="%an <%ae>" | sort -u                                     # atteso: solo Singh-Growe
```

Se un giorno comparisse un co-autore, la procedura di bonifica è in
[`CONVENZIONI-COMMIT.md`](CONVENZIONI-COMMIT.md).
