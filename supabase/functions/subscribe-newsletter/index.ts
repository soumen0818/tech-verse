/// <reference types="deno" />
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from '@supabase/supabase-js'


serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
        return new Response('Invalid email', { status: 400 })
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
})