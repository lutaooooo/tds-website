# 构建TDS

## Linux编译流程

## 编译

TDS使用UnityBuild，可以极大地降低构建时间

执行unityBuild文件生成脚本

```bash
node ./build/createUnityBuild.js
```

执行构建脚本

```bash
./build/build.sh
```

### 编译生成 aarch64 目标架构的程序

安装64位交叉编译器

```bash
sudo apt-get install g++-aarch64-linux-gnu
```

### 编译生成 arm 目标架构的程序

安装32位交叉编译器

```bash
sudo apt-get install g++-arm-linux-gnueabi
```

### 编译生成 X86_64/AMD64 目标架构程序 - Linux

```bash
sudo apt-get install g++
```

### 编译生成 X86_64/AMD64 目标架构程序 - Windows

安装msvc



## Windows编译流程

安装svn下载代码库 svn://gitee.com/liangtuSoft/tds

![](/develop/devFolderStructure.svg)
