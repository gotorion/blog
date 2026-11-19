---
title: "Tvm-tirx适配"
description: "本文记录tvm-tirx适配的学习记录"
pubDate: 2026-11-18
tags:
  - AI编译
---
## 了解 tvm-tirx

简而言之，tvm-tirx的开发者认为 Agent 开发 GPU Kernel已经是未来的趋势。尽管Agent可以直接编写CUDA或者PTX，但是程序化的验证依然是需要的。

tvm-tirx就是提供了一套精简但可拓展的编译器基础设施，比如IR集合。

## 使用 tvm-tirx

参考[官方文档](https://tvm.apache.org/tirx/get_started/quick_start.html)。

```python
import torch

import tvm_tirx
from tvm_tirx.script import tirx as T

n = T.dynamic("n")


@T.function
def add_one(A: T.Tensor((n,), T.float32), B: T.Tensor((n,), T.float32)):
    T.device_entry(launch=T.cuda.LaunchConfig(grid=T.ceildiv(n, 256), block=256))
    i = T.cuda.block_idx("x") * 256 + T.cuda.thread_idx("x")
    if i < n:
        B[i] = A[i] + 1

print(tvm_tirx.ir.format_tree(add_one))
```

运行代码得到的输出如下：

```
Function
├── params[0]: A = Var(ty=TensorType(shape=[n], dtype=float32))
├── params[1]: B = Var(ty=TensorType(shape=[n], dtype=float32))
└── body: SeqStmt
    └── seq[0]: RegionStmt(op=tirx.device_entry)
        ├── attrs: DictAttrs
        │   └── dict: Map
        │       ├── 'cuda.kernel_attrs': {}
        │       ├── 'cuda.launch_fields'[0]: 'grid.x'
        │       ├── 'cuda.launch_fields'[1]: 'grid.y'
        │       ├── 'cuda.launch_fields'[2]: 'grid.z'
        │       ├── 'cuda.launch_fields'[3]: 'block.x'
        │       ├── 'cuda.launch_fields'[4]: 'block.y'
        │       └── 'cuda.launch_fields'[5]: 'block.z'
        ├── args[0]: FloorDiv
        │   ├── a: Sub
        │   │   ├── a: Add
        │   │   │   ├── a: n
        │   │   │   └── b: IntImm(value=256)
        │   │   └── b: IntImm(value=1)
        │   └── b: IntImm(value=256)
        ├── args[1]: IntImm(value=1)
        ├── args[2]: IntImm(value=1)
        ├── args[3]: IntImm(value=256)
        ├── args[4]: IntImm(value=1)
        ├── args[5]: IntImm(value=1)
        ├── body_params: []
        ├── body: SeqStmt
        │   ├── seq[0]: Bind
        │   │   ├── var: i = Var(ty=int32)
        │   │   └── value: Add
        │   │       ├── a: Mul
        │   │       │   ├── a: Call(op=tirx.cuda.block_idx, attrs=None)
        │   │       │   │   ├── args[0]: StringImm(value='x')
        │   │       │   │   └── ty_args: []
        │   │       │   └── b: IntImm(value=256)
        │   │       └── b: Call(op=tirx.cuda.thread_idx, attrs=None)
        │   │           ├── args[0]: StringImm(value='x')
        │   │           └── ty_args: []
        │   └── seq[1]: If(else_case=None)
        │       ├── condition: LT
        │       │   ├── a: i
        │       │   └── b: n
        │       └── then_case: SeqStmt
        │           └── seq[0]: TensorStore(dest=B, indices=[i])
        │               └── value: Add
        │                   ├── a: TensorLoad(source=A, indices=[i])
        │                   └── b: FloatImm(value=1.0)
        └── result_vars: []
```

上面的结果看起来比较复杂，我们不知道这些Region之类的是什么东西，但是大概可以看出来这个树的结构和Python代码是对应的。

### IR

IR（Intermediate Representation），中文叫做中间表示，是编译器内部用来描述程序的一种数据结构。编译器通过 IR 来分析、优化和转换程序。

### AST 树

AST（Abstract Syntax Tree），也做抽象语法树，是编译器用来表示源代码结构的一种树形数据结构。因为源码本质上是一串文本，不便于编译器的遍历和分析。

了解上面两个概念可以知道，上面的树也是一种AST树，只不过不是前端Python的AST，而是TIRx 的 IR 树。

## tvm-tirx 的后端适配

看源码CUDA后端是从CodeGenC类继承，其实是把TIRx的IR Lower到CUDA之类的类C代码，然后通过厂商的编译器编译。
