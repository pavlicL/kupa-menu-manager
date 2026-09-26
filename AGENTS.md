<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Wine inventory and seasonal announcements live in Lovable Cloud tables with public-visible/admin-write policies, because the owner must edit both without code changes.
- Uploaded restaurant photos are referenced through Lovable Assets pointer files, because binary media should not be committed to the app repository.
