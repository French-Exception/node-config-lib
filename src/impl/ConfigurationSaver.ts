import {ConfigurationInterface} from "./../api/ConfigurationInterface"

export async function saveToFile(configuration: ConfigurationInterface, toFile: string): Promise<void> {
    await configuration.save(toFile)
}
