---
layout: project-blog-index
title: ETC blog
language: en
permalink: /projects/ethereum-classic/blog/
defaulturl: /projects/ethereum-classic/blog/
slug: blog
parent: ethereum-classic
categories: projects-blog
thumbnail: /images/scorex.jpg
visible: true
---
{% for post in site.categories['ethereum-classic'] %}
{% if page.language == post.language %}
{% if post.visible == true %}
<div class="{{ post.slug }}">
<p class="date marginb0"><span class="c_f00">{{ post.date | date: '%B %d, %Y' }}</span> by {{ post.author }}</p>
<h2 class="margint0"><a class="" href="{{ site.baseurl }}{{ post.permalink }}{% if page.language != 'en' %}/{{ page.language }}/{% endif %}">{{ post.title }}</a></h2>
<div class="text">{{post.excerpt}}</div>
</div>
{% endif %}
{% endif %}
{% endfor %}
