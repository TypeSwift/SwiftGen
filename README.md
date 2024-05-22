
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
  "inputDir": "path/to/ts-files",
  "outputDir": "path/to/output",
  "outputPrefix": "",
  "outputSuffix": ".swift",
  "outputFileName": "TypeSwift"
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
swiftgen --config ./config.json
```

Or simply:

```sh
swiftgen
```

### Additional Information

For more details, refer to the [TypeSwift project on GitHub](https://github.com/TypeSwift/TypeSwift).
