<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import { loggedIn, login } from '$lib/stores/auth.js'

    const defaultMessage = '\u3164' //invisible char for spacinh when no messasge
    let username = ''
    let password = ''
    let message = defaultMessage

    async function handleSubmit() {
        const ok = await login(username, password)

        if (!ok) {
            message = 'Incorrect username or password.'
            console.warn(message)
            return
        }            
        $loggedIn = true
        message = defaultMessage
        dispatch('submit')
    }
</script>

<div class="bg-primary fixed inset-0 z-50">
  <div class="hero glass h-screen">
      <div class="hero-content flex-col lg:flex-row-reverse glass rounded-box">
          <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div class="card-body pb-4">
                  <form on:submit|preventDefault={handleSubmit}>
                      <div class="form-control">
                          <label for="username" class="label">
                              <span class="label-text">Username</span>
                          </label>
                          <input id="username" type="text" bind:value={username} placeholder="username" class="input input-bordered" />
                      </div>
                      <div class="form-control">
                          <label for="password" class="label">
                              <span class="label-text">Password</span>
                          </label>
                          <input
                              id="password"
                              type="password"
                              bind:value={password}
                              placeholder="password"
                              class="input input-bordered"
                          />
                      </div>
                      <div class="form-control mt-6">
                          <button type="submit" class="btn btn-primary">Login</button>
                      </div>
                      <div class="{message === defaultMessage ? 'text-base-content' : 'text-error' } text-xs text-center pt-3">{message}</div> 
                  </form>
              </div>
          </div>
      </div>
    </div>
</div>
<!-- <p class="absolute bottom-16 w-full text-center z-50 text-primary-content text-xs">*or scan a tag to start</p> -->
