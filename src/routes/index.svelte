<script context="module">
    import List from '$lib/components/List.svelte'
    import ListItem from '$lib/components/ListItem.svelte'
</script>
<List>
    <ListItem>
        <div>primary 1</div>
        <div class="text-info">secondary1</div>
        <div slot="meta">meta</div>
    </ListItem>
    <ListItem>
        <div>item 2</div>
        <div slot="meta">meta2</div>
    </ListItem>
    <ListItem>
        <div>item 3</div>
        <div slot="meta">meta3</div>
    </ListItem>
</List>

