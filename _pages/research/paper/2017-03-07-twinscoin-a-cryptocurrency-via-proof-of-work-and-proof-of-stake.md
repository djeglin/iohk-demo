---
layout: page-research-papers
type: paper
title: "TwinsCoin: A Cryptocurrency via Proof-of-Work and Proof-of-Stake"
date: 2017-03-07
redirect: /research/papers/#EUWAPTAX
author: 'Alexander Chepurnoy, Tuyet Duong, Lei Fan, Hong-Sheng Zhou'
publisher: "Input Output"
language: en
permalink: /research/papers/twinscoin-a-cryptocurrency-via-proof-of-work-and-proof-of-stake/
slug: twinscoin-a-cryptocurrency-via-proof-of-work-and-proof-of-stake
parent: papers
categories: papers-Smart-Contracts
pdfurl: http://eprint.iacr.org/2017/232.pdf
blog_category: Proof-of-Stake
lib_search: Proof-of-Stake
visible: true
child: false
---
 We design and implement TwinsCoin, the rst cryptocurrency based on a provably secure and scalable public blockchain design using both proof-of-work and proof-of-stake mechanisms. Different from the proof-of-work based Bitcoin, our construction uses two types of resources, computing power and coins (i.e., stake). The blockchain in our system is more robust than that in a pure proof-of-work based system; even if the adversary controls the majority of mining power, we can still have the chance to secure the system by relying on honest stake. In contrast, Bitcoin blockchain will be insecure if the adversary controls more than 50% of mining power. Our design follows a recent provably secure proof-of-work/proof-of-stake hybrid blockchain by Duong et al. (ePrint 2016). In order to make our construction practical, we enhance Duong et al.’s design. In particular, we introduce a new strategy for difficulty adjustment in the hybrid blockchain and provide an analysis of it. We also show how to construct a light client for proof-of-stake cryptocurrencies and evaluate the proposal practically. We implement our new design. Our implementation uses a recent modular development framework for blockchains, called Scorex. It allows us to change only certain parts of an application leaving other codebase intact. In addition to the blockchain implementation, a testnet is deployed. Source code is publicly available.
