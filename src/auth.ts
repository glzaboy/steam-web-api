




/**
 * This file configures NextAuth for authentication in a Next.js application.
 * It imports necessary providers and adapters and sets up the authentication options.
 */

// Import the NextAuth library
import NextAuth from "next-auth";
// Import the D1Adapter for storing user data in a D1 database
import { D1Adapter } from "@auth/d1-adapter";
// Import the GitHub provider for GitHub OAuth authentication
import GitHub from "next-auth/providers/github";
// Import the Credentials provider for custom email/password authentication
import Credentials from "next-auth/providers/credentials";
// Import the Resend provider for email-based authentication
import Resend from "next-auth/providers/resend";



// Import the function to get the Cloudflare context
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Configure NextAuth with providers and adapter.
 * 
 * @returns {Object} An object containing handlers, signIn, signOut, and auth functions.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({









    // Define the authentication providers
    providers: [
        // Use GitHub as an authentication provider
        GitHub,
        // Use custom email/password credentials for authentication
        Credentials({
            // Define the credentials fields
            credentials: {
                // Email field for user input
                email: {},
                // Password field for user input
                password: {},
            }
        }),
        // Use Resend for email-based authentication
        Resend({
            // API key for Resend service
            apiKey: "re_Sx1ZeQ8a_LcNAVqPkFBe1CULxZ75YtrYk"
        })
    ],
    // Use the D1Adapter to store user data in the database
    adapter: D1Adapter(process.env.DB)

});