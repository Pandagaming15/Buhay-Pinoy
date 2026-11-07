package com.example

import org.junit.Assert.assertEquals
import org.junit.Test

class ExampleRobolectricTest {

  @Test
  fun testGameDefaults() {
    val initialWallet = 500
    val pandesalPrice = 5
    assertEquals(495, initialWallet - pandesalPrice)
  }
}
