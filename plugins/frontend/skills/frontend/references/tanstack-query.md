# How to write TanStack Query code in Eric way

## Structure

1. Put all request-layer files in `requests/`.
2. Put query keys in `requests/keys.ts`.
3. Put one request-options file per resource, such as `requests/users.ts`, `requests/projects.ts`, or `requests/settings.ts`.
4. Pages and components should import options from `requests/*`; they should not define raw query keys, request functions, or invalidation logic inline.

## Query Keys

1. Export one `queryKeys` object from `keys.ts`.
2. Use function keys everywhere, even for static keys: `list: () => ["users", "list"] as const`.
3. Give each resource an `all()` namespace key, then narrower keys like `lists()`, `list(filters)`, and `detail(id)`.
4. Use `null` for optional key parts, not `undefined`, so cache identity is stable.
5. For disabled detail queries, provide an explicit disabled key like `detailDisabled()` instead of inventing arrays in the component.

## Query Options

1. Export `xxxQueryOptions(params)` functions, not custom hooks, for reusable queries.
2. Each query options function should accept `{ api, enabled = true, staleTime = 30_000, ...domainParams }`.
3. Put `queryKey`, `queryFn`, `enabled`, and `staleTime` inside the options function.
4. Use `queryOptions(...)` so call sites keep strong inference with `useQuery` or `useSuspenseQuery`.
5. Use longer `staleTime` for mostly-static data such as presets, metadata, or lookup tables.

## Mutation Options

1. Export `xxxMutationOptions(params)` functions, not custom hooks, for reusable mutations.
2. Each mutation options function should accept `{ api, queryClient, onSuccess }`.
3. Define a named variables interface for non-trivial mutation inputs.
4. The mutation owns cache invalidation first, then calls the optional `onSuccess`.
5. Keep toast, navigation, panel state, and form reset in the page/component `onSuccess`, not in the request file.

## Invalidation

1. Put resource invalidation helpers next to that resource's query and mutation options.
2. Invalidate the resource namespace with `queryKeys.resource.all()` when the mutation changes many related views.
3. After broad invalidation, refetch only active lists when the UI needs immediate freshness.
4. If a mutation affects another resource, call that resource's invalidation helper explicitly.
5. Do not refetch the whole app.

## Usage

1. In components, get `queryClient` from `useQueryClient()`.
2. Use queries like `useSuspenseQuery({ ...userListQueryOptions({ api, filters }) })`.
3. Use mutations like `useMutation({ ...createUserMutationOptions({ api, queryClient, onSuccess }), onError })`.
4. Use `useSuspenseQuery` for required page data and `useQuery` for optional, disabled, or background data.
5. Keep form shaping, search state, selected keys, and panel mode in the page/component; keep request/cache behavior in `requests/*`.
