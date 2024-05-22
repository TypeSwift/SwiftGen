# SwiftGen

SwiftGen is a tool to convert TypeScript files into Swift code.

## Getting Started

### Installation

To install the package, run:

```sh
npm install -g swiftgen
```

### Configuration

Create a `config.json` file in your project directory. Example configuration:

```json
{
  "inputDir": "path/to/ts-files/root/dir",
  "outputDir": "path/to/output/dir",
  "outputPrefix": "",
  "outputSuffix": ".swift",
  "outputFileName": "TypeSwift",
  "debug": false
}
```

- `inputDir`: Path to TypeScript files that will be converted to Swift. The search is recursive.
- `outputDir`: Path to export the generated Swift file. It will replace any existing files with the same name and path.

### Usage

If you want to use a custom configuration file, run SwiftGen with the following command:

```sh
swiftgen --config path/to/config.json
```

If no configuration file is specified, SwiftGen will use the default `config.json` located in the `config` directory.

### Example

1. Create a `config.json` file in your project directory with the desired configuration.

2. Run the tool:

```sh
swiftgen --config /path/to/config.json
```

Or, if the `config.json` file is in your project root, simply:

```sh
swiftgen
```

*Compatible with both relative and absolute paths.*

### Updating SwiftGen

If you have installed SwiftGen globally and want to update it to the latest version, run:

```sh
npm update -g swiftgen
```

Alternatively, you can uninstall and reinstall the package:

```sh
npm uninstall -g swiftgen
npm install -g swiftgen
```

### Additional Information

For more details, refer to the [TypeSwift project on GitHub](https://github.com/TypeSwift/TypeSwift).
