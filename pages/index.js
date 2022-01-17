import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const defaultEndpointIssues = `https://api.github.com/repos/octocat/hello-world/issues`;

export async function getServerSideProps() {
  const res2 = await fetch(defaultEndpointIssues, {
    headers: {
      Authorization: process.env.GITHUB_TOKEN,
    },
  });
  const issues = await res2.json();

  return {
    props: {
      issues,
    },
  };
}

export default function Home({ issues }) {
  const defaultResults = issues;
  const [results, updateResults] = useState(defaultResults);
  const [currentIssues, updateCurrentIssues] = useState(defaultEndpointIssues);

  useEffect(() => {
    if (currentIssues === defaultEndpointIssues) return;

    async function request() {
      const resIssues = await fetch(currentIssues, {
        headers: {
          Authorization: process.env.GITHUB_TOKEN,
        },
      });
      const nextDataIssues = await resIssues.json();
      updateResults(nextDataIssues);
    }

    request();
  }, [currentIssues]);

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === 'username');
    const fieldRepository = fields.find((field) => field.name === 'repository');

    const username = fieldQuery.value || '';
    const repository = fieldRepository.value || '';

    const endpointIssues = `https://api.github.com/repos/${username}/${repository}/issues`;

    updateCurrentIssues(endpointIssues);
  }

  return (
    <div className='container'>
      <Head>
        <title>Git Issues</title>
        <link rel='icon' href='/github.svg' />
      </Head>

      <main>
        <motion.div
          initial='hidden'
          animate='visible'
          variants={{
            hidden: {
              scale: 0.8,
              opacity: 0,
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.4,
              },
            },
          }}
        >
          <h1 className='title'>
            <img src='/github.svg' alt='Github Logo' className='logo' />
            Github Search
          </h1>
        </motion.div>

        <p className='description'>Github Open Issues Search Engine</p>

        <form className='search' onSubmit={handleOnSubmitSearch}>
          <img src='/github.svg' alt='Github Logo' className='logo' />
          <input name='username' type='search' placeholder='username' />
          <a>/ </a>
          <input name='repository' type='search' placeholder='repository' />
          <button>.git</button>
        </form>

        <ul className='grid'>
          {results.length
            ? results.map((result) => {
                const { id, title, user, html_url, state, number, comments } =
                  result;
                return (
                  <motion.li
                    key={id}
                    className='card'
                    whileHover={{
                      position: 'relative',
                      zIndex: 1,
                      background: 'white',
                      scale: [1, 1.4, 1.2],
                      rotate: [0, 10, -10, 0],
                      filter: [
                        'hue-rotate(0) contrast(100%)',
                        'hue-rotate(360deg) contrast(200%)',
                        'hue-rotate(45deg) contrast(300%)',
                        'hue-rotate(0) contrast(100%)',
                      ],
                      transition: {
                        duration: 0.2,
                      },
                    }}
                  >
                    <Link href='${html_url}' as={`${html_url}`}>
                      <a target='_blank'>
                        <h3>
                          {title} #{number}
                        </h3>
                        <a className='state'>{state}</a>{' '}
                        <p className='containerInfo'>
                          {' '}
                          <img
                            src={user.avatar_url}
                            alt='Avatar'
                            className='avatar'
                          />
                          {user.login} opened this issue · {comments} comments
                        </p>
                      </a>
                    </Link>
                  </motion.li>
                );
              })
            : 'No results.'}
        </ul>
      </main>

      <footer>
        <a
          href='https://github.com/gnikov91'
          target='_blank'
          rel='noopener noreferrer'
        >
          Created with
          <img src='/heart.svg' alt='Hearth ico' className='logo' />
          by
          <img src='/github.svg' alt='Github Logo' className='logo' />
          gnikov91
        </a>
      </footer>
    </div>
  );
}
