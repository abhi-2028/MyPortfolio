function DsaSection({ profile }) {
  const github = profile?.socialLinks?.github || 'https://github.com'

  const topics = [
    'Two Pointers & Sliding Window',
    'Binary Search & Monotonic Arrays',
    'Tree Traversals (DFS/BFS)',
    'Dynamic Programming & Memoization',
    'Graph Algorithms & Cycle Detection',
    'Recursion & Backtracking',
    'Heap / Priority Queue Systems',
    'Hash Table Invariants',
    'Bitwise Manipulation',
  ]

  return (
    <section id="dsa_section" className="section-shell">
      <div className="container">
        <div className="section-meta-header" data-aos="fade-up">
          <div className="section-label-tag">
            <span>// 03</span>
            <span>· Problem Solving &amp; Algorithmic Foundations</span>
          </div>
          <h2 className="section-editorial-title">
            Computational rigor &amp; <em>algorithmic foundations</em>.
          </h2>
          <p className="section-editorial-lead">
            A dedicated practice in Data Structures and Algorithms in Java—building the mathematical and computational intuition required for high-throughput distributed backends.
          </p>
        </div>

        <div className="dsa-editorial-card" data-aos="fade-up" data-aos-delay="100">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h3 className="section-editorial-title" style={{ fontSize: '1.9rem', marginBottom: '0.75rem' }}>
                Algorithmic problem-solving in <em>Java</em>.
              </h3>
              <p className="text-secondary" style={{ fontSize: '1.05rem', lineHeight: '1.75' }}>
                Every production outage or scalability bottleneck traces back to an unexamined time or space complexity tradeoff. I dedicate consistent daily effort to algorithmic problem solving: proving correctness through loop invariants, analyzing cache-locality, and optimizing $O(N^2)$ brute forces into $O(N \log N)$ or $O(N)$ solutions.
              </p>
              <div className="dsa-topics-cluster">
                {topics.map((topic) => (
                  <span className="dsa-topic-tag" key={topic}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 bg-surface-elevated border border-secondary border-opacity-10 rounded">
                <div className="text-muted font-monospace small mb-2">// CORE PRINCIPLE</div>
                <blockquote className="font-serif fs-5 text-light fst-italic mb-3">
                  "First, solve the problem. Then, write the code. Finally, benchmark the time and space invariants."
                </blockquote>
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cinematic-secondary w-100 text-center"
                >
                  <span>Explore Solutions on GitHub ↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="dsa-metrics-row">
            <div className="dsa-metric-cell">
              <span className="dsa-metric-num">Java</span>
              <span className="dsa-metric-tag">Primary Algorithmic Language</span>
            </div>
            <div className="dsa-metric-cell">
              <span className="dsa-metric-num">O(1) / O(N)</span>
              <span className="dsa-metric-tag">Complexity Optimization Target</span>
            </div>
            <div className="dsa-metric-cell">
              <span className="dsa-metric-num">DSA</span>
              <span className="dsa-metric-tag">Core Undergraduate Discipline</span>
            </div>
            <div className="dsa-metric-cell">
              <span className="dsa-metric-num">Systems</span>
              <span className="dsa-metric-tag">Backend Architecture Application</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DsaSection
