import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Blocks, Compass, FileCode, Globe, Play, Wrench, Zap } from 'lucide-react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

type FeatureItem = {
 icon: LucideIcon;
 title: string;
 description: ReactNode;
};

const FeatureList: FeatureItem[] = [
 {
  icon: Globe,
  title: 'Cross-Platform Determinism',
  description: (
   <>
    Bit-exact results across all JavaScript engines, operating systems, and CPU architectures.
    Designed for networked lockstep gameplay where every client must compute identical state.
   </>
  ),
 },
 {
  icon: Zap,
  title: 'Performance by Design',
  description: (
   <>
    Zero-allocation hot paths, pre-computed operation variants, and branchless code where it
    matters. Built for 60+ FPS simulation loops with minimal GC pressure.
   </>
  ),
 },
 {
  icon: Blocks,
  title: 'Modular Architecture',
  description: (
   <>
    Independent packages for each engine layer. Install only what you need. Strict unidirectional
    dependencies ensure each package works standalone or as part of the full engine.
   </>
  ),
 },
 {
  icon: FileCode,
  title: 'TypeScript First',
  description: (
   <>
    Strict mode, structural interfaces for duck-typed interop, and tree-shakeable validation that
    strips dev-only assertions from production bundles via Dead Code Elimination.
   </>
  ),
 },
];

const PackageList = [
 {
  icon: Compass,
  name: '@lenguados/math2d',
  description:
   'Core 2D math primitives — vectors, matrices, rotations, transforms, complex numbers, intervals',
  to: '/docs/packages/math2d/overview',
 },
 {
  icon: Wrench,
  name: '@lenguados/common',
  description: 'Shared utilities for cross-cutting concerns',
  to: '/docs/packages/common/overview',
 },
 {
  icon: Play,
  name: '@lenguados/examples',
  description: 'Interactive demos and visual tests',
  to: '/docs/packages/examples/overview',
 },
];

function Feature({ icon: Icon, title, description }: FeatureItem) {
 return (
  <div className={clsx('col col--6')}>
   <div className={styles.featureCard}>
    <Icon size={32} strokeWidth={1.75} className={styles.featureIcon} aria-hidden="true" />
    <Heading as="h3">{title}</Heading>
    <p>{description}</p>
   </div>
  </div>
 );
}

export default function HomepageFeatures(): ReactNode {
 return (
  <>
   <section className={styles.features}>
    <div className="container">
     <div className="row">
      {FeatureList.map((props, idx) => (
       <Feature key={idx} {...props} />
      ))}
     </div>
    </div>
   </section>
   <section className={styles.packages}>
    <div className="container">
     <Heading as="h2" className="text--center">
      Packages
     </Heading>
     <div className="row">
      {PackageList.map((pkg) => (
       <div key={pkg.name} className={clsx('col col--4')}>
        <div className={styles.packageCard}>
         <Heading as="h3">
          <Link to={pkg.to}>
           <pkg.icon
            size={18}
            strokeWidth={1.75}
            className={styles.packageIcon}
            aria-hidden="true"
           />
           {pkg.name}
          </Link>
         </Heading>
         <p>{pkg.description}</p>
        </div>
       </div>
      ))}
     </div>
    </div>
   </section>
  </>
 );
}
