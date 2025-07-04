---
layout:     post
title:      "How I Created My Website for Free (and You Can Too)"
subtitle:   "The making of thebandar.co.in"
active: blog
image:
  feature: "my-website.jpeg"
date:       2025-06-29
header-img: "imgblog-img/my-website.jpeg"
tags: [portfolio, website, coding, AI, Jekyll, github]
comments: false
---

**This isn’t a tutorial, but it might as well be.**  
Here’s exactly how I built [**thebandar.co.in**](https://thebandar.co.in) — with a mix of **Jekyll**, **AI**, and a whole lot of **stubbornness**.

---

Finally, after a month of work here and there, my **portfolio website is ready**. I had started working on it midway through my summer break, after I kinda wasted the first half. I’ll get into the finer details, so that by the end of this blog, even you can make one for yourself — **without even knowing how to code**, and completely **for free** *(for context, I do know basic level coding).*

For months — literally as long as I can remember since I planned to make a website — I’ve tried many website builders. Free ones, freemium ones, trials, and even open-source ones. But all of them felt overwhelming in some way. I fiddled around with each tool and builder for about 2 days each, and they all gave me very **unsatisfactory results** — poor design flexibility, layout restrictions, annoying watermarks, or limited hosting.

### 💡 Enter GitHub + Jekyll

Finally, I came across **GitHub’s Jekyll**, a static site generator that lets you build and host your website **completely for free**. It gives you a default URL like `https://ACCOUNTNAME.github.io/PROJECTNAME/`. But if you want to use a custom domain, you can do that too.

In my case, I bought **thebandar.co.in** domain for around ₹700 for 3 years from [BigRock.in](https://www.bigrock.in), a domain registrar. You can use any registrar you like, but for me, BigRock was affordable and I haven’t had any issues so far.

There are multiple templates made by people like you and me. I personally chose to go with **Photograma**, a photography-themed portfolio template. It was last updated 7 years ago, but hey, it still works. For the blog layout, I took inspiration from **Galada**, another theme made by a contributor to Photograma. Links for both are on my [Projects](https://thebandar.co.in/projects) page.

Initially, you may need to tweak the `config.yml` file to make GitHub point the site to your project (just ask ChatGPT how to do this), and you’re all set to begin.

### 🧠 The AI Stack I Used

So basically what you need are **three tabs** — one with **ChatGPT**, one with **Deepseek**, and one with **Grok**.

- **Grok** gives the best layout ideas (in my opinion), but it's average at debugging.
- **Deepseek** is the best of the three — it makes your frontend look cleaner, finds errors on its own, and fixes them with minimal back-and-forth. The only issue is their servers are often busy, so you may need to switch between **R1 in and out**. Use R1 as much as possible, it’s better.
- I wouldn’t *recommend* ChatGPT for code, but if you need to write content for your page (like this blog), it’s useful. Keep it as a last resort if the others fail — which is rare.

A **crucial point** to remember is: these tools are still machines. You need to be **very specific** with your prompts. If you just say “make a box to display content,” it might place it in some random corner, use sharp edges, and pick a weird color. Instead, you have to specify: “center-aligned box, rounded edges, 70% width, 50% transparency.”

**Pro tip**:  
Tell ChatGPT what you want, then ask it to turn that into a proper prompt for the other tools. Saves a lot of frustration.  
Also, if some items are overlapping or broken visually, take a screenshot and give it to Grok or ChatGPT. **Deepseek only extracts text**, but visual tools help understand problems better and faster.

### 🧱 Understanding the Structure

There are multiple sections in a website like mine — homepage, projects, blog, about page, header, footer, navbar, layout, etc. And for each of these, there are multiple HTML, CSS, and JS files. Depending on the layout, the structure will vary.

To understand it all:
1. Copy the GitHub link of the template you like
2. Paste it in Grok
3. Turn on **Deepsearch** and ask it to give a **layman-style explanation** of each file (like you’re 10 years old)
4. Make a list of what you want changed
5. One by one, copy the contents of each file (like `projects.html`), paste it into the AI chat, and say what you want fixed

### 🔁 Another Pro Tip

Tell ChatGPT to imagine it’s a **senior-level fullstack developer** helping you build this site the way you want — structurally and visually. Then tell it to give you a prompt for the task.

Now copy that prompt, and paste it into a new chat.  
What happens is: ChatGPT now knows your goal, and will guide you step-by-step — from visual advice to layout structure. You just paste your HTML, ask for feedback, agree on a direction, and let it write your code.

**No brainstorming needed. It just works.**

Eventually, after editing each of the files one by one, you’ll slowly end up with exactly what you want.  
You can **pull it off without knowing how to code**, just by being consistent. I hadn’t touched code in almost two years — but now I can **read HTML** decently. Most of what I did was trial and error, but I’ve included all the tips and “what-not-to-do” lessons here to save you time.

### 🧪 Exploring: Void Codespace (Free AI Coding Tool)

While I built this site using browser tools, I recently started exploring **Void Codespace** — a **free, open-source coding assistant** that runs on your own laptop.

It works like ChatGPT inside a code editor. You can:
- Ask it to explain code
- Fix bugs
- Suggest improvements

Unlike GitHub Copilot or Cursor (both paid), **Void is 100% free**. But it does need a decent laptop (at least 8GB RAM) and takes a bit of setup. I’m still figuring it out, but if you want to go beyond just customizing and learn real web dev with AI, this is a solid tool to try.

### 📌 In Closing

There are more efficient ways to do this — like using VSCode with Cursor AI or GitHub Copilot — but those come with a price tag. I chose to stay on the **fully free path**. Even Void Codespace, while free, needs good hardware.

But honestly, if you’re willing to spend time learning and experimenting, **you can build your own site for free**, with help from AI and a little patience.

---

If you run into any issues and need help, feel free to:
- **Ping me on WhatsApp**
- Or email me if that’s your thing

If you liked my content, follow me on **Instagram** and **LinkedIn** to stay updated for my next post.

**Dream on.**

