import type { ReactNode } from 'react';

import clsx from 'clsx';
import { ArrowRight, BookOpen } from 'lucide-react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
 const { siteConfig } = useDocusaurusContext();
 const logoUrl = useBaseUrl('/img/logo.svg');
 return (
  <header className={clsx('hero', styles.heroBanner)}>
   <img
    src={logoUrl}
    alt=""
    aria-hidden="true"
    className={styles.heroLogo}
   />
   <div className="container">
    <Heading as="h1" className="hero__title">
     {siteConfig.title}
    </Heading>
    <p className="hero__subtitle">
     TypeScript&#8209;based, lightweight, deterministic,
     <br />
     and extensible 2&#8209;D physics engine.
    </p>
    <div className={styles.buttons}>
     <Link className={clsx('button button--lg', styles.buttonPrimary)} to="/docs/intro">
      Get Started <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
     </Link>
     <Link className={clsx('button button--lg', styles.buttonOutline)} to="/docs/api">
      <BookOpen size={18} strokeWidth={1.75} aria-hidden="true" /> API Reference
     </Link>
    </div>
   </div>
  </header>
 );
}

export default function Home(): ReactNode {
 const { siteConfig } = useDocusaurusContext();
 return (
  <Layout
   title="Deterministic 2D Physics Engine"
   description={siteConfig.tagline}
  >
   <HomepageHeader />
   <main>
    <HomepageFeatures />
   </main>
  </Layout>
 );
}
