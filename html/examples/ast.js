import { HTMLParser, HTMLAstOptimizer } from '../src/index.js';

// Example HTML content
const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Test Page</title>
  </head>
  <body>
    <!-- Navigation -->
    <nav class="menu">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
    
    <div class="content">
      <h1>Welcome!</h1>
      <p>This is a test page.</p>
    </div>
  </body>
</html>
`;

// Initialize parser and optimizer
const parser = new HTMLParser();
const optimizer = new HTMLAstOptimizer();

// Parse and optimize the HTML content
const ast = parser.parse(html);
const optimizedAst = optimizer.optimize(ast);

// Log the AST structures
if (!optimizedAst) {
  console.error('Optimization failed: No AST returned.');
} else {
  console.log('Original AST Structure:', JSON.stringify(ast, null, 2));
  console.log('Optimized AST Structure:', JSON.stringify(optimizedAst, null, 2));

  // Traverse both ASTs for comparison
  function traverseAST(node, depth = 0, isOptimized = false) {
    const indent = '  '.repeat(depth);
    const type = node.type || 'Unknown';
    const name = node.name || '';
    const value = node.value || '';
    
    console.log(`${indent}${isOptimized ? '[OPT] ' : ''}${type}${name ? ': ' + name : ''}${value ? ' = ' + value : ''}`);
    
    if (node.attributes && typeof node.attributes === 'object' && node.attributes.size > 0) {
      console.log(`${indent}Attributes:`, Object.fromEntries(node.attributes));
    }
    
    if (node.metadata?.isMinimized) {
      console.log(`${indent}[Minimized State: ${node.metadata.equivalenceClass}]`);
    }
    
    (node.children || []).forEach(child => traverseAST(child, depth + 1, isOptimized));
  }

  console.log('\nOriginal AST Traversal:');
  traverseAST(ast.root);
  
  console.log('\nOptimized AST Traversal:');
  traverseAST(optimizedAst.root, 0, true);

  // Log optimization metrics
  console.log('\nOriginal Metrics:');
  console.log('Total Nodes:', ast.metadata?.nodeCount || 0);
  console.log('Elements:', ast.metadata?.elementCount || 0);
  console.log('Text Nodes:', ast.metadata?.textCount || 0);
  console.log('Comments:', ast.metadata?.commentCount || 0);
  
  console.log('\nOptimization Metrics:');
  const { nodeReduction, memoryUsage, stateClasses } = optimizedAst.metadata.optimizationMetrics;
  console.log('Node Reduction:', `${((1 - nodeReduction.ratio) * 100).toFixed(1)}%`);
  console.log('Memory Savings:', `${((1 - memoryUsage.ratio) * 100).toFixed(1)}%`);
  console.log('State Classes:', stateClasses.count);
  console.log('Average Class Size:', stateClasses.averageSize.toFixed(2));
}